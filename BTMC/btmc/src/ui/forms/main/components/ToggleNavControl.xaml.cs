using System.Windows;
using System.Windows.Controls;

namespace btmc.src.ui.forms.main.components
{
    public partial class ToggleNavControl : UserControl
    {
        public event RoutedEventHandler ToggleClicked;
        public event RoutedEventHandler CleanClicked;

        public ToggleNavControl()
        {
            InitializeComponent();
        }

        // Dependency Properties
        public static readonly DependencyProperty IsBtmcCheckedProperty =
            DependencyProperty.Register(nameof(IsBtmcChecked), typeof(bool), typeof(ToggleNavControl), new PropertyMetadata(true));

        public static readonly DependencyProperty IsTernCheckedProperty =
            DependencyProperty.Register(nameof(IsTernChecked), typeof(bool), typeof(ToggleNavControl), new PropertyMetadata(false));

        public bool IsBtmcChecked
        {
            get => (bool)GetValue(IsBtmcCheckedProperty);
            set => SetValue(IsBtmcCheckedProperty, value);
        }

        public bool IsTernChecked
        {
            get => (bool)GetValue(IsTernCheckedProperty);
            set => SetValue(IsTernCheckedProperty, value);
        }

        private void Toggle_Click(object sender, RoutedEventArgs e)
        {
            IsBtmcChecked = BtmcToggle.IsChecked ?? false;
            IsTernChecked = TernToggle.IsChecked ?? false;

            ToggleClicked?.Invoke(this, e);
        }

        private void BtnClean_Click(object sender, RoutedEventArgs e)
        {
            CleanClicked?.Invoke(this, e);
        }
    }
}