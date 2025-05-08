using System.Runtime.CompilerServices;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using btmc.src.ui.forms.main.components;

namespace btmc
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        private enum _TabEnum { BTMC, TERN };
        private _TabEnum _activeTab = _TabEnum.BTMC;

        public MainWindow()
        {
            InitializeComponent();
            DataContext = this;
        }

        // BTMC tab properties
        public object BtmcInputOperation { get; set; }
        public object BtmcOutputOperation { get; set; }
        public string BtmcInputValue { get; set; } = string.Empty;
        public string BtmcOutputValue { get; set; } = string.Empty;

        // TERN tab properties
        public object TernInstructionOperation { get; set; }
        public string TernInput1Value { get; set; } = string.Empty;
        public string TernInput2Value { get; set; } = string.Empty;
        public string TernOutputValue { get; set; } = string.Empty;

        private void Window_MouseDown(object sender, MouseButtonEventArgs e)
        {
            if (e.ButtonState == MouseButtonState.Pressed)
                DragMove();
        }

        private void BtnClose_Click(object sender, RoutedEventArgs e)
        {
            Close();
        }

        private void BtnMinimize_Click(object sender, RoutedEventArgs e)
        {
            WindowState = WindowState.Minimized;
        }

        private void TcMain_SectionChanged(object sender, RoutedEventArgs e)
        {
            /* Uncomment after you add your custom TabControl to the form */
            //_activeTab = (_TabEnum)tcMain.SelectedIndex;
            // Decided to use toggle button, felt easier to make look nicer than tc, first iteration had tc
        }

        // Handler for when Clean button is clicked in the component
        private void ToggleNavigation_CleanClicked(object sender, RoutedEventArgs e)
        {
            switch (_activeTab)
            {
                default: break;
                case _TabEnum.BTMC:
                    BtmcPanel.ClearInputs();
                    break;
                case _TabEnum.TERN:
                    TernPanel.ClearInputs();
                    break;
            }
        }

        // Handler for when BTMC/TERN toggle is clicked in the component
        private void ToggleNavigation_ToggleClicked(object sender, RoutedEventArgs e)
        {
            var toggleControl = sender as ToggleNavControl;

            if (toggleControl == null)
                return;

            if (toggleControl.IsBtmcChecked)
            {
                _activeTab = _TabEnum.BTMC;
            }
            else if (toggleControl.IsTernChecked)
            {
                _activeTab = _TabEnum.TERN;
            }
        }

        // Placeholder stuff
        // Textbox event handlers
        private void TextBox_TextChanged(object sender, TextChangedEventArgs e)
        {
            var textBox = sender as TextBox;
            if (textBox == null) return;

            var placeholder = FindPlaceholder(textBox.Name);
            if (placeholder != null)
            {
                placeholder.Visibility = string.IsNullOrEmpty(textBox.Text) ? Visibility.Visible : Visibility.Collapsed;
            }
        }

        private void TextBox_GotFocus(object sender, RoutedEventArgs e)
        {
            var textBox = sender as TextBox;
            if (textBox == null) return;

            var placeholder = FindPlaceholder(textBox.Name);
            if (placeholder != null)
            {
                placeholder.Visibility = Visibility.Collapsed;
            }
        }

        private void TextBox_LostFocus(object sender, RoutedEventArgs e)
        {
            var textBox = sender as TextBox;
            if (textBox == null) return;

            var placeholder = FindPlaceholder(textBox.Name);
            if (placeholder != null)
            {
                placeholder.Visibility = string.IsNullOrEmpty(textBox.Text) ? Visibility.Visible : Visibility.Collapsed;
            }
        }

        // ComboBox event handlers
        private void ComboBox_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            var comboBox = sender as ComboBox;
            if (comboBox == null) return;

            var placeholder = FindPlaceholder(comboBox.Name);
            if (placeholder != null)
            {
                placeholder.Visibility = comboBox.SelectedItem == null ? Visibility.Visible : Visibility.Collapsed;
            }
        }

        private void ComboBox_GotFocus(object sender, RoutedEventArgs e)
        {
            var comboBox = sender as ComboBox;
            if (comboBox == null) return;

            var placeholder = FindPlaceholder(comboBox.Name);
            if (placeholder != null)
            {
                placeholder.Visibility = Visibility.Collapsed;
            }
        }

        private void ComboBox_LostFocus(object sender, RoutedEventArgs e)
        {
            var comboBox = sender as ComboBox;
            if (comboBox == null) return;

            var placeholder = FindPlaceholder(comboBox.Name);
            if (placeholder != null)
            {
                placeholder.Visibility = comboBox.SelectedItem == null ? Visibility.Visible : Visibility.Collapsed;
            }
        }

        // Helper method to find placeholder TextBlock based on control name
        private TextBlock FindPlaceholder(string controlName)
        {
            string placeholderName = controlName + "Placeholder";
            return FindName(placeholderName) as TextBlock;
        }

        private void BtnConvert_Click(object sender, RoutedEventArgs e)
        {
            switch (_activeTab)
            {
                default: break;
                case _TabEnum.BTMC:
                    // Do not implement
                    break;
                case _TabEnum.TERN:
                    // Do not implement
                    break;
            }
        }
    }
}
