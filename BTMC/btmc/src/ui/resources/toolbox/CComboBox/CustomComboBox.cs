using System.Windows;
using System.Windows.Controls;

namespace btmc.src.ui.resources.toolbox.CComboBox
{
    public class CustomComboBox : System.Windows.Controls.ComboBox
    {
        static CustomComboBox()
        {
            DefaultStyleKeyProperty.OverrideMetadata(typeof(CustomComboBox),
                new FrameworkPropertyMetadata(typeof(CustomComboBox)));
        }

        // Optional: CornerRadius property for rounded borders
        public CornerRadius CornerRadius
        {
            get => (CornerRadius)GetValue(CornerRadiusProperty);
            set => SetValue(CornerRadiusProperty, value);
        }

        public static readonly DependencyProperty CornerRadiusProperty =
            DependencyProperty.Register("CornerRadius", typeof(CornerRadius),
                typeof(CustomComboBox), new PropertyMetadata(new CornerRadius(3)));
    }
}
